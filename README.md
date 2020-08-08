# postcards
A social networking site for posting logistics.

#For functioning, follow these steps after firing up the nodeapi folder in VS code.

# 1. Create an .env file in root "nodeapi" folder and copy paste the below lines in it:

MONGODB_URI=mongodb+srv://ashutosh07:ashutosh07@postcard.ewqps.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=shhhhh

# 2. Open terminal on the root folder "nodeapi" and give the below command:
npm install
to install node_modules for nodeapi directory

# 3. Move to client directory by terminal from nodeapi root folder:
cd client

# 4. Install node_modules in client directory:
npm install

# 5. move back to root directory "nodeapi":
cd ..

# 6. Run both client and backend by one command:
npm run dev

this command will run both frontend and backend   

frontend will run at localhost:3000/ and backend at localhost:5000/

it will take a while to run the APP wait untill the APP runs.

#Note: For creating posts on the site the picture or file size should be less than 255kb.

