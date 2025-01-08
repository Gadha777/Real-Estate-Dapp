import React from 'react'
import logo from '../images/logo.png'
import { Link ,useNavigate} from 'react-router-dom'
import { ethers } from "ethers";

const Navbar = () => {
     // Connect to MetaMask
     async function connecttometamask() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log("Connected address:", signer.address);
            alert(`Connected to MetaMask: ${signer.address}`);
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Failed to connect to MetaMask. Please ensure it is installed and unlocked.");
        }
    }
  return (
    <div>
         {/* Navbar */}
      <header>
        <nav className='flex justify-between items-center px-12 bg-white'>
          <div className='flex'>
          <img src={logo} className='h-24 w-38 mt-[-10px] ml-[-50px]' alt="" />
          <div className=" font-bold text-5xl mt-6">Millow</div>

          </div>
          <div className="flex list-none  ">
          <Link className='ml-[-100px] my-3 rounded text-blue-900 px-4 py text-xl font-bold hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-sky-900 ' to="/">Home</Link>
            <Link className='my-3 text-blue-900 rounded px-4 py text-xl hover:bg-blue-500 font-bold hover:text-white hover:shadow-lg hover:shadow-cyan-900' to="/sell">Sell Now</Link>
            <Link className='my-3 text-blue-900 rounded px-4 py text-xl hover:bg-blue-500 font-bold hover:text-white hover:shadow-lg hover:shadow-cyan-900' to="/properties">Properties</Link>
            <Link className='my-3 rounded text-blue-900 px-4 py text-xl font-bold hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-sky-900 ' to="/purchased">Purchased</Link>
            <Link className='my-3 rounded text-blue-900 px-4 py text-xl font-bold hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-sky-900 ' to="/sold">Sold</Link>


          </div>
          <button className="px-5 py-2 bg-blue-500 text-white  rounded cursor-pointer hover:shadow-lg  hover:shadow-sky-900" onClick={connecttometamask}>Connect</button>
        </nav>
      </header>

    </div>
  )
}

export default Navbar