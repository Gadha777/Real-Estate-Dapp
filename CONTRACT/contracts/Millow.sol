// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract Millow {
    //Defining a Plot structure to represent a property.
    struct Plot {
        uint256 id;
        string name;
        string location;
        uint256 size; // in square feet or preferred unit
        uint256 price; // in wei
        string img;
        address owner;
        bool sold;
        string contactNumber;
    }
    
 // State variable to track the number of plots added
    uint256 private plotCounter;
    mapping(uint256 => Plot) public plots; // Mapping to store plots by their unique ID
    mapping(address => uint256[]) private addedPlots;//addedPlots is a mapping that stores an array of plot IDs for each address (user).    // Mapping to track plots added by each address
    mapping(address => uint256[]) private boughtPlots;

    // Event emitted when a plot is added
    event PlotAdded(uint256 plotId,string name, string location, uint256 size, uint256 price, string img, address indexed owner);
    event PlotBought(uint256 plotId, address indexed buyer, uint256 price ,string contactNumber);

    // Add a new plot
    function addPlot(
        string memory _name,
        string memory _location,
        uint256 _size,
        uint256 _price,
        string memory _img
    ) public {
        require(bytes(_location).length > 0, "Location is required");
        require(_size > 0, "Size must be greater than zero");
        require(_price > 0, "Price must be greater than zero");
        require(bytes(_img).length > 0, "Image URL is required"); // Added check for img

        // Increment the plot counter to generate a new ID
        plotCounter++;
        plots[plotCounter] = Plot({
            id: plotCounter,
            name:_name,
            location: _location,
            size: _size,
            price: _price,
            img: _img,
            owner: msg.sender,
            sold: false,
            contactNumber: ""
        });
                // is used to track the plots that are added by a specific user                 
                addedPlots[msg.sender].push(plotCounter);//addedPlots is a mapping that stores an array of plot IDs for each address (user).
        emit PlotAdded(plotCounter,_name, _location, _size, _price, _img, msg.sender);
        
    }
    // View all plots
    function viewPlots() public view returns (Plot[] memory) {
        Plot[] memory allPlots = new Plot[](plotCounter);
        for (uint256 i = 1; i <= plotCounter; i++) {
            allPlots[i - 1] = plots[i];
        }
        return allPlots;
    }
    
    // View specific plot details
    function viewPlotDetails(uint256 _plotId) public view returns (Plot memory) {
        Plot memory plot = plots[_plotId];
        require(plot.id != 0, "Plot does not exist");
        return plot;
    }
 // View specific plot details by location
    // function viewPlotDetailsByLocation(string memory _location) public view returns (Plot memory) {
    //     uint256 plotId = locationToPlotId[_location];
    //     require(plotId != 0, "Plot does not exist");
    //     return plots[plotId];
    // }

// Buy a plot with owner address, price, and contact number
function buyPlot(
    uint256 _plotId, 
    string memory _contactNumber, 
    address _owner, 
    uint256 _price
) 
    public 
    payable 
{
// The function creates a reference to a Plot struct stored in the blockchain's state.
    Plot storage plot = plots[_plotId];// The plot with the ID _plotId is retrieved from the plots mapping.

    // Ensure the plot exists and is not sold already
    require(plot.id != 0, "Plot does not exist");
    require(!plot.sold, "Plot already sold");

    // Ensure the correct price is sent
    require(msg.value == _price, "Incorrect payment amount; send the exact price in wei");

    // Ensure the owner address is valid
    require(_owner != address(0), "Invalid owner address");

    // Update the contact number for the buyer
    plot.contactNumber = _contactNumber;

    // Transfer the payment to the owner
    payable(_owner).transfer(msg.value);

    // Transfer ownership of the plot to the buyer and mark it as sold
    plot.owner = msg.sender; // The buyer (msg.sender) becomes the new owner
    plot.sold = true;

    // Record the plot in the buyer's list of bought plots
    boughtPlots[msg.sender].push(_plotId);

    // Emit an event with the plot ID, buyer address, price, and contact number
    emit PlotBought(_plotId, msg.sender, _price, _contactNumber);
}

    // View added plots by the connected account
    function viewAddedPlots() public view returns (Plot[] memory) {
        uint256[] memory plotIds = addedPlots[msg.sender];
        Plot[] memory userPlots = new Plot[](plotIds.length);

        for (uint256 i = 0; i < plotIds.length; i++) {
            userPlots[i] = plots[plotIds[i]];
        }

        return userPlots;
    }

    // View bought plots by the connected account
    function viewBoughtPlots() public view returns (Plot[] memory) {
        uint256[] memory plotIds = boughtPlots[msg.sender];
        Plot[] memory userBoughtPlots = new Plot[](plotIds.length);

        for (uint256 i = 0; i < plotIds.length; i++) {
            userBoughtPlots[i] = plots[plotIds[i]];
        }

        return userBoughtPlots;
    }
   
}


