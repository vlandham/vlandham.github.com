#!/usr/bin/env ruby

require 'json'

csv_filename = ARGV[0]
json_filename = ARGV[1]

output_filename = csv_filename.split(".")[0..-2].join(".") + "_only.csv"
puts output_filename

if !csv_filename or !json_filename
  puts "ERROR no input"
  exit
end

json_data = JSON(File.open(json_filename).read)


ids = json_data['features'].map {|feature| feature["properties"]["GEOID10"]}

puts "total ids: #{ids.size}"


output_file = File.open(output_filename, 'w')
header_data = []
total = 0
File.open(csv_filename, 'r') do |file|
  file.each_line do |line|
    if file.lineno == 1
      header_data = line.split(",")
      output_file.puts line
    else
      data = Hash[header_data.zip(line.split(","))]
      #puts data.inspect
      if ids.include? data["GEOID"]
        output_file.puts line
        total += 1
      end
    end
  end
end
puts "total csv: #{total}"

output_file.close
