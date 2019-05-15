# Taskify
A personalised, collaborative, To-Do List application.  Add as many people as you want and keep track of Group goals and progress.

# Features
<ul>
  <li>Create a group from existing users, and keep track of group goals and progress.</li>
  <li>Maintain your own To-Do lists.</li>
  <li>Edit any existing task.</li>
  <li>Remove tasks from lists when they're completed.</li>
</ul>

# How to use
Go to <a href="https://taskifyyy.firebaseapp.com" title="Taskify">Taskify</a> and choose your preffered method of sign in. If you haven't signed up already, then clicking on a sign in method will sign you up for a new account. The Tasks tab is for your personal tasks, and the Groups tab is for your task groups.

# Building from the repo
<ul>
  <li>Clone the repository, then navigate to it on your terminal and run <code>npm install</code>.</li>
  <li>Once all the dependencies have finished downloading, create a new Firebase project, click on 'Add Firebase to your web app'.</li>
  <li>Then copy the api key and other details you find there and replace the dummy text in <code>src/environments/environment.ts</code> and <code> src/environments/environment.prod.ts</code>.</li>
  <li>In firebase, under authentication, enable Google and Facebook as sign in providers.</li>
  <li>Run <code>ng serve </code> to test it, run <code>ng build --aot --prod --output-hashing none</code> to create a production build, and then <code>firebase deploy</code> to deploy it to firebase.</li>
</ul>



