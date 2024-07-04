import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Button, Card, Image } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import { USDT_ADDY } from './config'
import Web3 from 'web3'
import ERC20ABI from 'erc-20-abi'

function App() {
  const [address, setAddress] = useState("")
  const [usdtBalance, setUsdtBalance] = useState("0")
  const [ethVal, setEthVal] = useState("0")

  const web3 = useMemo(() => {
    return new Web3(window.ethereum)
  }, [window.ethereum, Web3])

  const btnhandler = async () => {
    if (window.ethereum) {
      await window.ethereum.enable()
      const accounts = await web3.eth.getAccounts()
      setAddress(accounts[0])
    } else {
      alert("install metamask extension!!");
    }
  };

  useEffect(() => {
    if (web3.utils.isAddress(address)) {
      const callbalance = async () => {
        web3.eth.getBalance(address).then(
          val => {
            setEthVal(web3.utils.fromWei(val, 'ether'))
          }
        )
        const usdtContract = new web3.eth.Contract(ERC20ABI, USDT_ADDY)
        const _usdtBalance = await usdtContract.methods.balanceOf(address).call()
        setUsdtBalance(web3.utils.fromWei(_usdtBalance, 'mwei'))
      };
      callbalance()
    }
  }, [address, web3, USDT_ADDY])

  return (
    <>
      <div className="App container-fluid">
        {/* Calling all values which we 
       have stored in usestate */}

        <Card className="text-center w-full">
          <Card.Header>
            <strong>Address: </strong>
            {address}
          </Card.Header>
          <Card.Body>
            <Button
              onClick={btnhandler}
              variant="primary"
            >
              Connect to wallet
            </Button>
            {address && (
              <>
                <p className='d-flex gap-1 justify-content-center mt-3'>
                  <Image src="/assets/ethereum.jfif" width={30} />
                  {ethVal} ETH
                </p>
                <p className="d-flex gap-1 justify-content-center">
                  <Image src="/assets/tether.png" width={30} />
                  {usdtBalance} usdt
                </p>
              </>
            )}

          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default App
