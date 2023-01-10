
# Crowd Funding

This is a simple decenterlized application (Dapp) built on Goerli testnet in which a person could create a project for which he need the funding and withdraw the money.

In this Multiple projects can be made and multiple donars can donate to any project they are willing to.

If no project exists or no donars exists and user tries to access it forcefully by puting wrong index it would give invalid index error.
## Features

- ### Create Project
A person could create project for which he needs the funding by setting the name and amount needed with help og create button 
- ### Get the funds collected
The owner of a particular project could withdraw the money collected from donars only if they are allowed by the donors using request button in Get Funding card
- ### Donate to project
Anyone who is willing to contribute to any project can be done so by using donate button by entring the address of the project he/she willing to contribute and amount
- ### Allow the owner of project
Allow button will be used by donars to allow the specific project owner to spend the funding collected  

- ### Get project details
A particular owner could check the projects created by him with help of Get Project 

- ### Get donor details
All the donors could be get by using Get donars

- ### List donar of particular project
Donors of particular project could be get by using Show Donars

- ### Withdraw donar
If at certain moment donar feels to withdraw his contribution it could be done by using withdraw button



## Demo

https://crowdfunding-mu.vercel.app/


## Tech Stack
The frontend is built using React

On the Web3 side, the contract is written in Solidity and compiled and deployed. 

For interaction with frontend ether.js library is used
## Limitations

- The most prominent limitation of this Crowd Funding system is that it's proper functioning is heavily dependent on how it's going to be interacted with. The buttons are not turned off (i.e. made un-clickable) at any moment. So, if a participant decides to just go ahead and randomly start clicking the buttons in between transactions, the application is mostly likely going to report an error or even worse, it may crash. Therefore, patiently wait for the transaction to complete and the updates to appear on screen

- If user tries to access any project or donar which doesnot exists or has been closed, he will get alert message saying Invalid Index!

- Creator of project would not be able to donate to its own project

- User could only withdraw his contribution before the project is closed means once the target amount of particular project is reached donar would not be able to withdraw his money

- Only the owner of project would be able to get the money means any other project's owner will not be able to get money of another project

- Onwer would get money only if target is reached else not

- The contract is manually tested using Remix IDE.

 
## What I Learned

- How to create Multiple projects and map particular donors to that specific project


