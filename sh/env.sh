# config database enviroment variable
# export DB_CONNECTION=mongodb
# export DB_HOST=localhost
# export DB_PORT=27017
# export DB_NAME=chatzalo_nodejs
# export DB_USERNAME=""
# export DB_PASSWORD=""

#config app enviroment
export APP_HOST=ec2-54-169-181-35.ap-southeast-1.compute.amazonaws.com
export APP_PORT=3000

#config session key and secret
export SESSION_KEY="express.sid"
export SESSION_SECRET="mySecret"

#config admin email account
export MAIL_USER=vantrung44.it@gmail.com
export MAIL_PASSWORD=***
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587

#config facebook login app
export FB_APP_ID=392070039003221
export FB_APP_SECRET=acbae07db6c2a673981e41191d3a8213
export FB_CALLBACK_URL=http://ec2-54-169-181-35.ap-southeast-1.compute.amazonaws.com:3000/auth/facebook/callback

#config google login app
export GG_APP_ID=489064763664-78pgraqhi8geqedbgu82cd2s1af5m9l0.apps.googleusercontent.com
export GG_APP_SECRET=-9KXcsLGLkjm77aFJn3sQ7Bk
export GG_CALLBACK_URL=http://ec2-54-169-181-35.ap-southeast-1.compute.amazonaws.com:3000/auth/google/callback
