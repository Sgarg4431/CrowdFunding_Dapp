// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
struct Project {
    string name;
    address payable owner;
    uint256 amountNeeded;
    uint256 amountRequested;
    bool amountFullfilled;
    address[] donors;
    uint allowed;
}
struct Donor {
    uint256 amountDonated;
    address projectDonated;
    address ownAddress;
}

contract CrowdFunding {
    Project[] public projects;
    Donor[] public donors;

    function projectExist(address addr) internal view returns (int256) {
        for (uint256 i = 0; i < projects.length; i++) {
            if (projects[i].owner == addr) return int256(i);
        }
        return -1;
    }

    function donorExist(address addr) internal view returns (int256) {
        for (uint256 i = 0; i < donors.length; i++) {
            if (donors[i].ownAddress == addr) return int256(i);
        }
        return -1;
    }

    function closeProject(address addrP) internal {
        int256 index = projectExist(addrP);
        Project memory project;
        project = projects[projects.length - 1];
        projects[projects.length - 1] = projects[uint256(index)];
        projects[uint256(index)] = project;
        projects.pop();
    }

    function createProject(string memory _name, uint256 _amountNeeded)
        external
    {
        require(projectExist(msg.sender) == -1, "Project already exists");
        Project memory project;
        project.name = _name;
        project.amountNeeded = _amountNeeded;
        project.amountRequested = _amountNeeded;
        project.owner = payable(msg.sender);
        projects.push(project);
    }

    function donate(address addrP) external payable {
        int256 index = projectExist(addrP);
        require(index != -1, "Project doesnot exists");
        require(
            projects[uint256(index)].amountFullfilled == false,
            "Project closed"
        );
        require(
            projects[uint256(index)].owner != msg.sender,
            "Cannot donate to own projects"
        );
        Donor memory donor;
        if (msg.value > projects[uint256(index)].amountNeeded) {
            payable(msg.sender).transfer(
                msg.value - projects[uint256(index)].amountNeeded
            );
            donor.amountDonated = projects[uint256(index)].amountNeeded;
            donor.projectDonated = addrP;
            donor.ownAddress = msg.sender;
            projects[uint256(index)].amountFullfilled = true;
            projects[uint256(index)].amountNeeded = 0;
            projects[uint256(index)].donors.push(msg.sender);
            donors.push(donor);
        } else if (msg.value == projects[uint256(index)].amountNeeded) {
            donor.amountDonated = projects[uint256(index)].amountNeeded;
            donor.projectDonated = addrP;
            donor.ownAddress = msg.sender;
            projects[uint256(index)].amountNeeded = 0;
            projects[uint256(index)].amountFullfilled = true;
            projects[uint256(index)].donors.push(msg.sender);
            donors.push(donor);
        } else {
            donor.amountDonated = msg.value;
            donor.projectDonated = addrP;
            donor.ownAddress = msg.sender;
            projects[uint256(index)].amountNeeded -= msg.value;
            projects[uint256(index)].donors.push(msg.sender);
            donors.push(donor);
        }
    }

    function withdraw() external {
        int256 i = donorExist(msg.sender);
        require(i != -1, "Donar doesnot exists");
        address add = donors[uint256(i)].projectDonated;
        int256 index = projectExist(add);
        require(
            projects[uint256(index)].amountFullfilled == false,
            "Project closed"
        );
        projects[uint256(index)].amountNeeded += donors[uint256(i)]
            .amountDonated;
        payable(msg.sender).transfer(donors[uint256(i)].amountDonated);
        Donor memory donor;
        donor = donors[donors.length - 1];
        donors[donors.length - 1] = donors[uint256(index)];
        donors[uint256(index)] = donor;
        donors.pop();
        Project memory project;
        project = projects[projects.length - 1];
        projects[projects.length - 1] = projects[uint256(index)];
        projects[uint256(index)] = project;
        projects[uint256(index)].donors.pop();
        //delete(projects[uint(index)].donars[uint(i)]);
        //delete(donars[uint(i)]);
    }

    function requestMoney(address addrP) external {
        int256 index = projectExist(addrP);
        require(index != -1, "Project does not exists");
        require(
            projects[uint256(index)].owner == msg.sender,
            "You are not owner of project"
        );
        require(
            projects[uint256(index)].amountNeeded == 0,
            "not sufficient amount collected"
        );
        require(projects[uint(index)].allowed>=donors.length/2,"Not allowed");
        uint256 balance = projects[uint256(index)].amountRequested;
        (projects[uint256(index)].owner).transfer(balance);
        closeProject(addrP);
    }

    function showDonars(address addrP)
        external
        view
        returns (address[] memory)
    {
        int256 index = projectExist(addrP);
        require(index != -1, "Project does not exists");
        require(
            projects[uint256(index)].owner == msg.sender,
            "You are not owner of project"
        );
        return projects[uint256(index)].donors;
    }

    function allow(address addrP) external {
        int256 index = projectExist(addrP);
        require(index != -1, "Project does not exists");
        require(
            projects[uint256(index)].owner != msg.sender,
            "You are the owner of project"
        );
        int256 i = donorExist(msg.sender);
        require(i != -1, "Donar doesnot exists");
        require(
            projects[uint256(index)].amountFullfilled == true,
            "Amount not fullfilled"
        );
        projects[uint(index)].allowed++;
    }
}
