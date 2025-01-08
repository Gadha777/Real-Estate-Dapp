import React, { useEffect, useState } from "react";
import { ethers } from "ethers"; // Ensure ethers is correctly imported
import ABI from "../assets/Millow.json";
import address from "../assets/deployed_addresses.json";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";

const Sold = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedPlots = async () => {
      try {
        // Ensure window.ethereum is available
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }

        // Connect to the Ethereum provider using Web3Provider and get the contract instance
        const provider = new Web3Provider(window.ethereum); // Correctly access Web3Provider
        await provider.send("eth_requestAccounts", []); // Request account access
        const signer = provider.getSigner(); // Get the signer

        const cAbi = ABI.abi;
        const cAddress = address["MillowModule#Millow"];

        // Ensure the contract address and ABI are correct
        if (!cAddress || !cAbi) {
          throw new Error("Contract address or ABI is missing");
        }

        const realEstateInstance = new ethers.Contract(cAddress, cAbi, signer);

        // Call the `viewAddedPlots` function from the contract
        const addPlots = await realEstateInstance.viewAddedPlots();

        // Parse the results and update the state
        const plots = addPlots.map((plot) => ({
          id: plot.id.toString(),
          name: plot.name,
          location: plot.location,
          size: plot.size.toString(),
          price: plot.price.toString(), // Convert Wei to Ether
          img: plot.img,
          owner: plot.owner,
          sold: plot.sold,
          contactNumber: plot.contactNumber,
        }));

        setProperties(plots);
      } catch (error) {
        console.error("Error fetching plots:", error);
        setError("Failed to fetch properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedPlots();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="text-center bg-cover bg-center bg-sky-900 text-white px-5 h-[650px]">
        {loading ? (
          <p className="text-center text-2xl font-bold p-10 text-white">
            Loading sold properties...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-2xl font-bold p-10 text-white">
            Nothing sold yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="border p-4 mt-4 bg-gray-100 ml-[40px] w-[300px] mt-[80px] rounded"
              >
                <img
                  src={property.img}
                  alt="Plot"
                  className="w-full h-28 object-cover mt-2"
                />
                <div className="flex ml-8">
                  <p className="text-sky-900 text-2xl text-left text-2xl mt-[20px]">
                    <strong>{property.price} WEI</strong>
                  </p>
                  <Link
                    className="rounded bg-sky-900 text-white ml-[20px] my-4 p-1"
                    to={`/view-more/${property.id}`}
                  >
                    View More
                  </Link>
                </div>
                <h2 className="font-bold text-sky-900">
                  Property ID : {property.id}
                </h2>
                <p className="text-sky-900">
                  <strong> Location : {property.location}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sold;