"use client";

import { useEffect, useState } from "react";
import { Add } from "iconsax-react";

import { ethers } from "ethers";
import TodoManagerContract from "@/artifacts/contracts/TodoManager.sol/TodoManager.json";

import TodoCard from "@/components/TodoCard";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea";

const MetaMaskIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1.28rem" height="1.2rem" viewBox="0 0 256 240">
			<path fill="#e17726" d="M250.066 0L140.219 81.279l20.427-47.9z" />
			<path fill="#e27625" d="m6.191.096l89.181 33.289l19.396 48.528zM205.86 172.858l48.551.924l-16.968 57.642l-59.243-16.311zm-155.721 0l27.557 42.255l-59.143 16.312l-16.865-57.643z" />
			<path fill="#e27625" d="m112.131 69.552l1.984 64.083l-59.371-2.701l16.888-25.478l.214-.245zm31.123-.715l40.9 36.376l.212.244l16.888 25.478l-59.358 2.7zM79.435 173.044l32.418 25.259l-37.658 18.181zm97.136-.004l5.131 43.445l-37.553-18.184z" />
			<path fill="#d5bfb2" d="m144.978 195.922l38.107 18.452l-35.447 16.846l.368-11.134zm-33.967.008l-2.909 23.974l.239 11.303l-35.53-16.833z" />
			<path fill="#233447" d="m100.007 141.999l9.958 20.928l-33.903-9.932zm55.985.002l24.058 10.994l-34.014 9.929z" />
			<path fill="#cc6228" d="m82.026 172.83l-5.48 45.04l-29.373-44.055zm91.95.001l34.854.984l-29.483 44.057zm28.136-44.444l-25.365 25.851l-19.557-8.937l-9.363 19.684l-6.138-33.849zm-148.237 0l60.435 2.749l-6.139 33.849l-9.365-19.681l-19.453 8.935z" />
			<path fill="#e27525" d="m52.166 123.082l28.698 29.121l.994 28.749zm151.697-.052l-29.746 57.973l1.12-28.8zm-90.956 1.826l1.155 7.27l2.854 18.111l-1.835 55.625l-8.675-44.685l-.003-.462zm30.171-.101l6.521 35.96l-.003.462l-8.697 44.797l-.344-11.205l-1.357-44.862z" />
			<path fill="#f5841f" d="m177.788 151.046l-.971 24.978l-30.274 23.587l-6.12-4.324l6.86-35.335zm-99.471 0l30.399 8.906l6.86 35.335l-6.12 4.324l-30.275-23.589z" />
			<path fill="#c0ac9d" d="m67.018 208.858l38.732 18.352l-.164-7.837l3.241-2.845h38.334l3.358 2.835l-.248 7.831l38.487-18.29l-18.728 15.476l-22.645 15.553h-38.869l-22.63-15.617z" />
			<path fill="#161616" d="m142.204 193.479l5.476 3.869l3.209 25.604l-4.644-3.921h-36.476l-4.556 4l3.104-25.681l5.478-3.871z" />
			<path fill="#763e1a" d="M242.814 2.25L256 41.807l-8.235 39.997l5.864 4.523l-7.935 6.054l5.964 4.606l-7.897 7.191l4.848 3.511l-12.866 15.026l-52.77-15.365l-.457-.245l-38.027-32.078zm-229.628 0l98.326 72.777l-38.028 32.078l-.457.245l-52.77 15.365l-12.866-15.026l4.844-3.508l-7.892-7.194l5.952-4.601l-8.054-6.071l6.085-4.526L0 41.809z" />
			<path fill="#f5841f" d="m180.392 103.99l55.913 16.279l18.165 55.986h-47.924l-33.02.416l24.014-46.808zm-104.784 0l-17.151 25.873l24.017 46.808l-33.005-.416H1.631l18.063-55.985zm87.776-70.878l-15.639 42.239l-3.319 57.06l-1.27 17.885l-.101 45.688h-30.111l-.098-45.602l-1.274-17.986l-3.32-57.045l-15.637-42.239z" />
		</svg>
	);
};

const Address = "0xb28238020A46389b88049D6F479c69A4957160F7"

export default function Home() {

	const [walletAddress, setWalletAddress] = useState(null)
	const [correctNetwork, setCorrectNetwork] = useState(false)

	const [contract, setContract] = useState(null);

	const [todos, setTodos] = useState([{
		title: "Fix Pitstop Team Registration",
		content: "Change the category generation and fix backend 500 error"
	}])

	async function requestWalletAndConnect() {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert("Metamask not detected")
				return
			}

			const chainId = await ethereum.request({ method: 'eth_chainId' })
			const testNetworkId = '0x539'
			if (chainId !== testNetworkId) {
				console.log(chainId)
				alert("You are not connected to Local Ganache Network")
				setCorrectNetwork(false)
				return
			} else {
				setCorrectNetwork(true)
			}

			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			const contract = new ethers.Contract(Address, TodoManagerContract.abi, signer);

			const todos = await contract.getAllTodos();
			console.log(todos);

			setContract(contract)
			setWalletAddress(signer.address)

		} catch (error) {
			console.log(error)
		}
	}

	async function createTodo() {
		try {
			if (contract) {
				const txn = await contract.addTodo("Ye hua na kaam chaluuu");
				let receipt = await txn.wait();
				let gasUsed = receipt.gasUsed;
				// let gasPrice = await contract.provider.getGasPrice();
				// let transactionFeeWei = gasUsed.mul(gasPrice);

				console.log(receipt, gasUsed);

			}
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		if (!contract || !walletAddress) {
			requestWalletAndConnect()
		}
	}, [])

	return (
		<main className="relative flex min-h-screen flex-col items-start justify-center p-24" suppressHydrationWarning>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Decen Todo ~
			</h1>
			<div className="flex items-center justify-center mb-4 w-full">
				<p className="text-sm font-medium leading-none text-slate-400 mt-4 mr-auto">
				{contract && walletAddress ? (
					"✅ Connection Established! Manage and create your todo's on blockchain."
				) : (
					"🔃 Load your wallet and wait for us to connect with the contract."
				)}
				</p>

				<Drawer>
					<DrawerTrigger className="flex items-center justify-center">
						<Button variant="ghost">
							<Add size={28} className="mr-2 h-4 w-4" /> Create new todo
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Create a new todo</DrawerTitle>
							<DrawerDescription>This action will create a new block on the blockchain containing the todo.</DrawerDescription>
						</DrawerHeader>

						<Textarea
							className="w-auto mx-4 border-slate-800 bg-[#252525]"
							placeholder="What's on your mind ..."
						/>

						<DrawerFooter className={"w-full flex flex-row items-center justify-center"}>
							<Button onClick={createTodo}>Submit</Button>
							<DrawerClose>
								<Button className="w-full">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
				<hr className="rotate-90 bg-white w-[1.8rem] opacity-30" />

				<Button onClick={requestWalletAndConnect} variant="ghost">
					<MetaMaskIcon />
					{walletAddress ? (
						<span className="ml-2">Wallet Connected.</span>
					) : !correctNetwork ? (
						<span className="ml-2">Please Connect to Local Network</span>
					) : (
						<span className="ml-2">Connect my wallet</span>
					)}
				</Button>
			</div>
			<hr className="mb-10 bg-gray-100 opacity-20 w-full mb-10" />

			<TodoCard />
			<TodoCard />

			{/* <CreateTodo /> */}
		</main>
	);
}
