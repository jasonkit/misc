css: css/rt.less
	lessc $< > css/style.css

rss:
	sh ../tools/gen_blog_rss.sh "R.T." "http://jasonkit.github.io/rt" "隨想" > rss.xml

.PHONY: css rss
