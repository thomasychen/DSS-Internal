# DSS-Internal
Internal Website for DSSers


How to set up locally after cloning, open the project in vscode and open 2 terminals:
Frontend terminal:
1. cd to client
2. check you have node installed by typing npm, you should see all the options for commands like start, install etc
3. delete the package-lock.json file
4. run npm install

Backend terminal:
1. cd out of the repo one level by doing cd ..
2. make a python venv by doing python -m venv dss-internal-env
3. cd back into the repo
4. run source dss-internal-env/bin/activate (replace bin with scripts if on windows)
5. cd to backend
6. run pip install -r requirements.txt


At this point your environment is set up, but if you run npm start in your frontend terminal and python run.py in your backend terminal, the website will run but logging in will not work. please contact me on slack or messenger to get the required environment secrets to finish setup.
Final step:
Now you can run python run.py in your backend terminal and let it keep running, and run npm start in your frontend terminal. The localhost:3000 should pop up and the website should work!
   
