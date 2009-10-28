import wsgiref.handlers
import cgi
import urllib
from google.appengine.ext import webapp
from google.appengine.api import urlfetch
 
class TwitterSearchController(webapp.RequestHandler):
	"""Proxy for Ajax calls to search.twitter.com"""
	def get(self):
		twitterSearchEndpoint = 'http://search.twitter.com/search.json'
		params = self.request.GET
		apiquery = urllib.urlencode(params)
 
		result = urlfetch.fetch(url=twitterSearchEndpoint + '?' + apiquery, method=urlfetch.GET)
		self.response.out.write(result.content)
 
def main():
	application = webapp.WSGIApplication(
		[('/search.json', TwitterSearchController)],
		debug=True)
	wsgiref.handlers.CGIHandler().run(application)
 
if __name__ == "__main__":
	main()