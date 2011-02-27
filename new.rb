#!/usr/bin/env ruby

# Script to create a jekyll blog post using a template. It takes one input parameter
# which is the title of the blog post
# e.g. command:
# $ ./new.rb "helper script to create new posts using jekyll"

# Some constants
TEMPLATE = "template.textile"
TARGET_DIR = "_posts"

# Get the title which was passed as an argument
title = ARGV[0]
# Get the filename
filename = title.gsub(' ','-')
filename = "#{ Time.now.strftime('%Y-%m-%d') }-#{filename}.textile" 
filepath = File.join(TARGET_DIR, filename)

# Create a copy of the template with the title replaced
new_post = File.read(TEMPLATE)
new_post.gsub!('TITLE', title);

# Write out the file to the target directory
new_post_file = File.open(filepath, 'w')
new_post_file.puts new_post
new_post_file.close

puts "created => #{filepath}"