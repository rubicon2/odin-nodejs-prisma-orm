# odin-nodejs-prisma-orm

https://www.theodinproject.com/lessons/nodejs-prisma-orm

The purpose of this project was to figure out a problem I was having with odin-nodejs-file-uploader.

I wanted to save form values and error messages upon posting a form, and redirect to the same form
and present the form values and error messages to the user. You cannot pass data around from route to route
unless you save it to the req.session.

So there are middlewares for saving the form fields to the req.session, and then clearing them. The idea
is that the form fields are saved when the form is posted, and if the form fails validation for any reason,
the user can be redirected to the same form they filled out with helpful error messages and their existing
values still present. It is a lot better to be able to edit your existing form values than re-enter everything.
In fact from a user perspective that would be incredibly annoying.

Anyway, the clearRouteData middlware on the project was not working all the time. When using the express session
dev memory store it would work 100% of the time, but with prisma it would rarely work. Often it would just fail
to clear the data at all. I assumed this was due to the added latency of interfacing with the database - maybe
I forgot to await somewhere, or failed to put some code in the req.session.save() callback. But no.

It appears that calling next() to invoke middleware after a response has been sent to the client is a bad idea.
There is something else that can be used: res.on('finish', callback). This seems to have solved the problem, and it
clears the routeData 100% of the time.

It seems strange, because the middlware after the response was sent was triggering breakpoints - it was definitely
being called, but for some reason deleting the routeData and then saving the session just wasn't saving.

From what I have read online, making changes to the req or res objects after calling req.send() is a no no.
Have not been able to find out why though.
