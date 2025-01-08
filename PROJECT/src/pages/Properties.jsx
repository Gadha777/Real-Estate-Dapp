import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../assets/Millow.json";
import address from "../assets/deployed_addresses.json";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import P1 from '../images/p1.jpg';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        // Ensure window.ethereum is available
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }

        // Connect to the Ethereum provider using Web3Provider and get the contract instance
        const provider = new ethers.BrowserProvider(window.ethereum);
        // await provider.send("eth_requestAccounts", []); // Request account access
        const signer = await provider.getSigner(); // Get the signer

        const cAbi = ABI.abi;
        const cAddress = address["MillowModule#Millow"];

        // Ensure the contract address and ABI are correct
        if (!cAddress || !cAbi) {
          throw new Error("Contract address or ABI is missing");
        }

        const realEstateInstance = new ethers.Contract(cAddress, cAbi, signer);

        // Call the `viewPlots` function from the contract
        const allPlots = await realEstateInstance.viewPlots();

        // Parse the results and update the state
        const plots = allPlots.map((plot) => ({
          id: plot.id.toString(),
          location: plot.location,
          size: plot.size.toString(),
          price: plot.price.toString(), // Convert Wei to Ether
          img: plot.img,
          owner: plot.owner,
          sold: plot.sold,
        }));

        setProperties(plots);
      } catch (error) {
        console.error("Error fetching plots:", error);
        setError("Failed to fetch properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  return (
    <div >
      <Navbar />
      <div className="text-center bg-cover bg-center bg-sky-900  text-white px-5 "
      // style={{ backgroundImage: `url(${P1})` }}
      >
       {/* <h1 className="text-2xl font-bold mb-4">All Properties</h1> */}
       {loading ? (
        <p className="text-center text-2xl font-bold p-10 text-white ">Loading properties...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4  ">
          {properties.map((property) => (
            <div key={property.id} className="border p-4 mt-4 bg-gray-100 ml-[40px] w-[300px] mt-[80px] rounded">
              <img src={property.img} alt="Plot" className="w-full h-28 object-cover mt-2" />
              <div className="flex ml-8">
              <p className="text-sky-900 text-2xl text-left text-2xl mt-[20px] "><strong>{property.price} WEI</strong> </p>
              <Link className="rounded bg-sky-900 text-white  ml-[20px] my-4 p-1" to={`/view-more/${property.id}`}>View More</Link>
              </div>
              <h2 className="font-bold text-sky-900 ">Property ID : {property.id}</h2>
              <p className="text-sky-900"><strong> Location :  {property.location}</strong> </p>
              {/* <p><strong>Size:</strong> {property.size} sqft</p> */}
             
              {/* <p><strong>Owner:</strong> {property.owner}</p> */}
              <p><strong>Sold:</strong> {property.sold ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}
     </div>
    </div>
  );
};

export default Properties;