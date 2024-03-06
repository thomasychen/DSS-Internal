# DSS-Internal
Internal Website for DSSers

How to run locally:

Using 2 separate terminal instances 

Frontend: 
1. cd to client/ folder
2. make sure you have node installed (brew install node for mac)
3. run npm install (if it errors, try deleting the package-lock.json file under client/ and rerun.
4. run npm start

Backend:
1. outside of this repo entirely, (using "cd ..") set up a virtual environment using python3.11 -m venv dss-internal-env
2. cd back into the repo, then into backend/
3. call source dss-internal-env/bin/activate (replace bin with scripts if in windows)
4. do pip install -r requirements.txt
5. run python run.py

Troubleshooting:
During this process, you should error because you do not have the .env file for client/ or backend/ which stores our project secrets. Please contact Tommy via messenger, or slack to get this information to finish the setup.
