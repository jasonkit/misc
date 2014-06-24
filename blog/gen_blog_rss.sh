#!/bin/bash

title=$1
url=$2
description=$3

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
echo "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\"><channel>"
echo "<atom:link href=\"$url/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />"
echo "<title>$title</title>"
echo "<link>$url</link>"
echo "<description>$description</description>"
for article in `ls -t ./article`
do
	article_short=`echo $article | sed "s/.txt//g"`
	echo "<item>"
	echo "<link>${url}/?article=$article_short</link>"
	echo "<guid>${url}/?article=$article_short</guid>"
	echo "<title>`head -1 ./article/$article`</title>"
	echo "</item>"
done

echo "</channel></rss>"
