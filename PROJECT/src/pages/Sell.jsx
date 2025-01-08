import React, { useState } from 'react';
import axios from 'axios';
import ABI from '../assets/Millow.json';
import address from '../assets/deployed_addresses.json';
import { ethers } from 'ethers';
import Navbar from '../Components/Navbar';
import P1 from '../images/p3.jpg'; // Correct image import
import { useNavigate } from "react-router-dom";

const Sell = () => {
    const navigate = useNavigate();
    const [plot, setPlot] = useState({
        name:'',
        location: '',
        size: '',
        price: '',
        img: ''
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setPlot((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!plot.name ||!plot.location || !plot.size || !plot.price) {
            alert('All fields are required!');
            return;
        }

        if (isNaN(plot.size) || Number(plot.size) <= 0) {
            alert('Size must be a positive number!');
            return;
        }

        if (isNaN(plot.price) || Number(plot.price) <= 0) {
            alert('Price must be a positive number!');
            return;
        }

        try {
            // Upload image to IPFS
            const fileData = new FormData();
            fileData.append('file', plot.img);

            const responseData = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                fileData,
                {
                    headers: {
                        pinata_api_key: "8dbadc626658051a353f",
                        pinata_secret_api_key: "23d7e82a502ac87c3f21e4c9606709055d362c34261d236c24b41afa96c6cb0d",
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const fileUrl = 'https://gateway.pinata.cloud/ipfs/' + responseData.data.IpfsHash;
            console.log(fileUrl);

            // Interact with the smart contract
            const provider = new ethers.BrowserProvider(window.ethereum);
            // await provider.send('eth_requestAccounts', []); // Connect to wallet
            const signer = await provider.getSigner();
            console.log(signer);
            
            const cAbi = ABI.abi;
            const cAddress = address['MillowModule#Millow'];
            const realEstateInstance = new ethers.Contract(cAddress, cAbi, signer);
            console.log(realEstateInstance);
            console.log(plot.name);
            

            const transaction = await realEstateInstance.addPlot(
                plot.name,
                plot.location,
                plot.size,
                plot.price,
                fileUrl
            );
      
            
            console.log('Transaction receipt:', transaction);
            alert('Plot added successfully!');
            setPlot({ name: '' ,location: '', size: '', price: '', img: '' }); // Reset form
            navigate('/')
        } catch (error) {
            console.error('Error interacting with the contract:', error);
            alert('Failed to add the plot.');
        }
    }

    return (
        <div
            className="bg-cover bg-no-repeat bg-center h-full"
            style={{ backgroundImage: `url(${P1})` }} // Apply p1 as background image
        >
            <Navbar />
            <form onSubmit={handleSubmit} className="ml-[10px] pb-4">
                <div className="border border-black-500 bg-white w-2/5 ml-[400px] rounded mt-8 h-2/5">
                    <h2 className="text-2xl font-bold text-center text-sky-900 mt-6 tracking-wide">
                    Put up for sale                    </h2>
                    <div className="ml-[70px] mt-4">
                        <label htmlFor="name" className="text-sky-900 font-semibold text-l">
                            Name*
                        </label>
                        <br />
                        <input
                            className="rounded text-white bg-sky-700 w-10/12 mt-2 h-7"
                            type="text"
                            placeholder="   Enter the name"
                            name="name"
                            id="name"
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <div className="ml-[70px] mt-4">
                        <label htmlFor="location" className="text-sky-900 font-semibold text-l">
                            Location*
                        </label>
                        <br />
                        <input
                            className="rounded text-white bg-sky-700 w-10/12 mt-2 h-7"
                            type="text"
                            placeholder="   Enter the location"
                            name="location"
                            id="location"
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <div className="ml-[70px] mt-2">
                        <label htmlFor="size" className="text-sky-900 font-semibold text-l">
                            Size (sqft)*
                        </label>
                        <br />
                        <input
                            className="rounded text-white bg-sky-700 mt-2 w-10/12 h-7"
                            type="number"
                            placeholder="   Enter the size of the plot"
                            name="size"
                            id="size"
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <div className="ml-[70px] mt-2">
                        <label htmlFor="price" className="text-sky-900 font-semibold text-l">
                            Price (in wei)*
                        </label>
                        <br />
                        <input
                            className="rounded text-white bg-sky-700 w-10/12 mt-2 h-7"
                            type="number"
                            placeholder="   Enter the price of the plot"
                            name="price"
                            id="price"
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <div className="ml-[70px] mt-2">
                        <label htmlFor="image" className="text-sky-900 font-semibold text-l">
                            Image Url*
                        </label>
                        <br />
                        <input
                            className="rounded text-white bg-sky-700 mt-2 w-10/12 h-7"
                            type="file"
                            name="img"
                            id="img"
                            onChange={(e) =>
                                setPlot((prevState) => ({
                                    ...prevState,
                                    img: e.target.files[0], // Update the img field with the selected file
                                }))
                            }
                        />
                    </div>
                    <br />
                    <div className="ml-44 mt-2 rounded w-40 h-10 p-2 pl-6 bg-sky-700 text-white hover:bg-sky-900 mb-8">
                        <input className="button1 px-6" type="submit" value="Add Plot" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Sell;