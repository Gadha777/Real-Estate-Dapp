import React, { useState } from 'react';
import p1 from '../images/p5.jpg';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import ABI from '../assets/Millow.json';
import address from '../assets/deployed_addresses.json';
import { ethers } from 'ethers';

const Home = () => {
  const [search, setsearch] = useState('');
  const [plotData, setPlotData] = useState(null); // To store plot data if found
  const navigate = useNavigate();

  // Handle input change
  function handlechange(e) {
    setsearch(e.target.value);
    console.log('Search ID:', e.target.value);
  }

  // Function to search for the plot by its ID
  const searchPlotById = async () => {
    if (!search.trim()) {
      alert('Please enter a Plot ID');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const cAbi = ABI.abi;
      const cAddress = address['MillowModule#Millow'];
      const realEstateInstance = new ethers.Contract(cAddress, cAbi, signer);

      // Fetch plot details from blockchain
      const plot = await realEstateInstance.viewPlotDetails(search);
      console.log('Plot data from blockchain:', plot);

      // Set the plot data
      setPlotData({
        id: plot.id,
        location: plot.location,
        size: plot.size,
        price: plot.price.toString(), // Convert price from Wei to Ether
        img: plot.img,
        owner: plot.owner,
        sold: plot.sold,
      });
    } catch (error) {
      console.error('Error fetching plot details:', error);
      alert('Plot not found in the blockchain');
      setPlotData(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="text-center bg-cover bg-center  text-white px-5 h-[650px]"
        style={{ backgroundImage: `url(${p1})` }}
      >
        <h1 className="text-5xl font-bold text-white pt-[70px]">Search it. Explore it. Buy it.</h1>
        <input
          type="text"
          className="mt-5 p-1 w-2/5 border-none text-black rounded"
          onChange={handlechange}
          placeholder="Enter a Plot ID"
        />
        <button
          className="bg-sky-500 mt-10 p-1 ml-2 rounded w-32 hover:bg-blue-500"
          onClick={searchPlotById}
        >
          Search
        </button>

        {/* Homes Section */}
        {plotData && (
          <section className="px-5 py-12">
            <div className="flex justify-around flex-wrap">
              <div className="w-[300px] border border-[#ddd] rounded-lg overflow-hidden m-5 mt-[-10px] shadow-md">
                <img src={plotData.img} className="w-full h-[200px]" alt="Property" />
                <div className="p-4 bg-white">
                  <h3 className="mt-1 text-sky-900 font-bold text-xl">{plotData.price} WEI</h3>
                  <p className="mb-1 text-sky-900">{plotData.location}</p>
                  <Link
                    className="bg-sky-900 p-1 rounded"
                    to={`/view-more/${plotData.id}`}
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!plotData && search && (
          <p className="text-white mt-10 text-l font-bold">No plot found for the entered ID.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
