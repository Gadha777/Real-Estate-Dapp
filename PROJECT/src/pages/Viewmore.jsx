import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../assets/Millow.json";
import address from "../assets/deployed_addresses.json";
import Navbar from "../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

const ViewMore = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  // const [buyerAddress, setBuyerAddress] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPlotDetails = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const cAbi = ABI.abi;
        const cAddress = address["MillowModule#Millow"];
        const realEstateInstance = new ethers.Contract(cAddress, cAbi, signer);
 console.log(realEstateInstance);
 
        console.log("Fetching details for plot ID:", id);
        const plot = await realEstateInstance.viewPlotDetails(id);
        setProperty({
          id: plot.id.toString(),
          name: plot.name,
          location: plot.location,
          size: plot.size.toString(),
          price: plot.price.toString(),
          img: plot.img,
          owner: plot.owner,
          sold: plot.sold,
        });

        // Fetch the buyer's address (connected wallet address)
        const buyer = await signer.getAddress();
        setBuyerAddress(buyer);

      } catch (error) {
        console.error("Error fetching plot details:", error);
      }
    };

    fetchPlotDetails();
  }, [id]);

  const handleBuyPlot = async () => {
    if (!contactNumber) {
      alert("Please enter your contact number.");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const cAbi = ABI.abi;
      const cAddress = address["MillowModule#Millow"];
      const realEstateInstance = new ethers.Contract(cAddress, cAbi, signer);
  
      // Convert price to Wei (if it's not already in Wei)
      const priceInWei = ethers.parseUnits(property.price, "wei");
  
      console.log("Sending value in Wei:", priceInWei);
  
      // Call buyPlot function on the contract and send the value
      const transaction = await realEstateInstance.buyPlot(id, contactNumber, property.owner, priceInWei, {
        value: priceInWei, // Pay the plot price (in Wei)
        gasLimit: 1000000, // Optional: set a higher gas limit if necessary
      });
  
      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
      console.log("Transaction Receipt:", receipt);
  
      alert("Plot purchased successfully!");
      navigate('/');
      setProperty((prev) => ({ ...prev, sold: true, owner: signer.getAddress() }));
      setShowModal(false);
    } catch (error) {
      console.error("Error buying plot:", error);
      alert("Failed to buy the plot. Please try again.");
    }
  };
  

  return (
    <div>
      <Navbar />
      {property && (
        <div className="p-4 bg-sky-900">
          <h1 className="text-2xl text-white font-bold text-sky-900 my-4 text-center">Property Details</h1>
          <div className="text-sky-900 text-lg w-[600px] ml-[310px] bg-whiteborder p-4 bg-gray-100 ml-[40px] w-[300px] mt-[30px] rounded">
            <img src={property.img} alt="Property" className="w-full h-56 object-cover mb-4" />
            <div className="flex">
              <p className="p-2"><strong>Property ID:</strong> {property.id}</p>
              <button
                className="text-white px-4 rounded hover:bg-green-700 ml-[300px] bg-sky-900"
                onClick={() => setShowModal(true)}
                disabled={property.sold}
              >
                {property.sold ? "Sold" : "Buy Now"}
              </button>
            </div>
            <p className="p-2"><strong>Location:</strong> {property.location}</p>
            <p className="p-2"><strong>Size:</strong> {property.size} sqft</p>
            <p className="p-2"><strong>Price:</strong> {property.price} WEI</p>
            <p className="p-2"><strong>Owner:</strong> {property.owner}</p>
            <p className="p-2"><strong>Status:</strong> {property.sold ? "Plot is no longer for sale" : "No"}</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl text-sky-900 font-bold mb-4">Enter Details to Buy Plot</h2>
            <div className="mb-4">
              <label className="block text-sky-900 mb-2">Plot ID:</label>
              <input
                type="text"
                value={property.id}
                disabled
                className="w-full text-white bg-sky-900 px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sky-900 mb-2">Contact Number:</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter Contact Number"
                className="w-full text-white bg-sky-900 px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sky-900 mb-2">Owner Address:</label>
              <input
                type="text"
                value={property.owner}
                disabled
                className="w-full text-white bg-sky-900 px-3 py-2 border rounded"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sky-900 mb-2">Buyer Address:</label>
              <input
                type="text"
                value={buyerAddress}
                disabled
                className="w-full text-white bg-sky-900 px-3 py-2 border rounded"
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-sky-900 mb-2">Price (WEI):</label>
              <input
                type="text"
                value={property.price}
                disabled
                className="w-full text-white bg-sky-900 px-3 py-2 border rounded"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBuyPlot}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMore;
