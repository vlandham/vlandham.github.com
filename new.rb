#!/usr/bin/env ruby

# Create a new blog post in _posts.
# e.g. command:
# $ ./new.rb "helper script to create new posts using jekyll"

title = ARGV[0] or abort "usage: ./new.rb \"Post title\""
slug = title.downcase.strip.gsub(/[^a-z0-9]+/, '-').gsub(/^-|-$/, '')
filepath = File.join("_posts", "#{Time.now.strftime('%Y-%m-%d')}-#{slug}.md")
abort "#{filepath} already exists" if File.exist?(filepath)

File.write(filepath, <<~POST)
  ---
  layout: post
  title: #{title.dump}
  ---

POST

puts "created => #{filepath}"
