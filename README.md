# Microsoft_Teams_Clone
A interactive web app that is the clone of an application already available with the name "MICROSOFT TEAMS".

## Screenshots:
  ![oneononegood](https://user-images.githubusercontent.com/59930751/125209622-b8aa6780-e2b7-11eb-8aa7-a093e0da3ec4.png)
  ![screenshare](https://user-images.githubusercontent.com/59930751/125209634-c95add80-e2b7-11eb-95e1-b524ea588f8e.png)
  ![videonofffinal](https://user-images.githubusercontent.com/59930751/125209640-d972bd00-e2b7-11eb-87d7-78e8f5b00ee5.png)
  ![multiuser](https://user-images.githubusercontent.com/59930751/125209646-e42d5200-e2b7-11eb-8ada-519d1a89e449.png)

## Features of the Web-App:
  * Video Call One-to-one.
  * Invite via link feature.
  * Video Call Conference (Connection upto 6 users is possible but it works perfectly for upto 4 users, hangs a little bit for 6 users)
  * User can Mute/Unmute himself.
  * User can Mute/Unmute other users and increase/decrease their volume at his end during Group as well as One-on-One Call.
  * User can turn on/off his own Video.
  * Chat Feature during both One-on-One and Conference Call.
  * Screen share allowed during One-on-One Call and during Conference Call as well(Here, it is only visible to one of the Users).
  * Picture-in-Picture mode allowed.
  * User can switch anyone's video(including himself) to Full Screen mode.
  * User can Play/Pause anyone's video.
  * User can Record his Video during both One-on-One Call as well as Conference Call.
  * User can Record his Screen during both One-on-One Call as well as Conference Call.
  * Leave from the meeting feature.
  
<!-- ## Table of Contents: -->

## Technology Stack to be used:
  * EJS
  * CSS
  * Javascript
  * NodeJs 
  * webRtc(peer.js)

## Demo link of the project
(Youtube link will be added here)

## Resources used in making the WebApp:
  Some of the references used for implementation of this Web App are:
  </br>
  * https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/
  * https://www.youtube.com/watch?v=XWL_Rzqk4CY&t=155s
  * https://shadidhaque.medium.com/building-a-video-chat-application-with-socket-io-and-typescript-9fe9f4567594

## How to run this Project on Local System ?
* Download the Zip. (Refer youtube tutorials to clone/download zip if you face any issue)
* Extract the folder named as "Microsoft_Teams_Clone-master".
* Open the above folder in any IDE you prefer to use. Visual Studio Code was used for this project.
* Open the terminal and check the location.
* Install essential dependencies like socket.io , express , nodemon , ejs using command : [npm install "dependency name"] (write dependency name without " " and command without [])
* Run command node server.js.
* Open Google Chrome (preferred) and go to the link "localhost:4000/"
* Copy this link and open it in a new tab.
* Congrats!! You managed to run webapp on your local system.

## Platform Used to deploy the WebApp:
Heroku.com

## Steps to deploy:
* All you need is an account on heroku
* Create Heroku account
* Link the Heroku account to git repository
* This will generate the url where your app is running
* Click on the url.
* Congrats!! You are done. <br />
<br />Some of the references used to Deploy the Web-App:
1) https://devcenter.heroku.com/articles/node-websockets
2) https://www.youtube.com/watch?v=MxfxiR8TVNU&t=311s

## Link and Steps to run the deployed App :
Link:
  https://vast-shore-44600.herokuapp.com/
<br />Steps:
* Open the link in your browser.
* You will get unique key on screen, add it to the link. Eg: "link/unique_key".
* Share this unique link with your friends with whom you want to talk.
* Here you go.Your Video Conversion Started. Isn't it?
* Also, this may need refreshing the browser at the User1 end for the connection to established.
