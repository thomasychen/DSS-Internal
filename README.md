# DSS-Internal

## Internal Website for Members of Data Science Society @ Berkeley

Link to Presentations:
- Midterm Deliverable ([Link](https://docs.google.com/presentation/d/1IjBoi-kGEJncKmGKTYgPFywGeW8xR4xQfmGGh53wbQU/edit?usp=sharing))
- Final Deliverable ([Link](https://docs.google.com/presentation/d/1M5T-ayfLaauE-B9l70486H_451_hwqcMfJKTwUGB77E/edit?usp=sharing))

Link to Website:
https://floating-tor-01392-a251bb952f37.herokuapp.com/

If you can't sign in (and you are in DSS), you must fill out the Airtable registration form to populate your personal information!

---

## Developer Set-up
Open the project in VSCode and open two terminals:
Frontend terminal:

1. cd to client
2. check you have node installed by typing npm, you should see all the options for commands like start, install etc
3. delete the package-lock.json file
4. run npm install

Backend terminal:

1. cd out of the repo one level by doing cd ..
2. make a python venv by doing python3 -m venv dss-internal-env
3. cd back into the repo
4. run source dss-internal-env/bin/activate (replace bin with scripts if on windows)
5. cd to backend
6. run pip3 install -r requirements.txt

At this point your environment is set up, but if you run npm start in your frontend terminal and python3 run.py in your backend terminal, the website will run but logging in will not work. please contact me on slack or messenger to get the required environment secrets to finish setup.
Final step:
Now you can run python run.py in your backend terminal and let it keep running, and run npm start in your frontend terminal. The localhost:3000 should pop up and the website should work!
