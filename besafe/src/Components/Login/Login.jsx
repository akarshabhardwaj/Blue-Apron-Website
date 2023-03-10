import React from 'react'
import style from "./Login.module.css"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    InputLeftElement,
    Icon,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { MdPassword, MdEmail } from 'react-icons/md';
import { AuthContext } from "../../Context/AuthContextProvider";
import { Link } from 'react-router-dom';
import AdminLogin from '../../Admin Panel/Login/AdminLogin';

const Login = () => {
    const val = React.useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [details, setDetails] = React.useState({
        email: "",
        pass: ""
    });
    const [show, setShow] = React.useState(false)
    const handleChange = (e) => {
        let type = e.target.name;
        console.log(type);
        const value = e.target.value;
        setDetails({ ...details, [type]: value });
    }
    const handleSubmit = () => {
        console.log(details);
        
        fetch("https://dark-red-goshawk-gown.cyclic.app/users/login", {
            method: "POST",
            body: JSON.stringify(details),
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => res.json())
            .then(res => {
                if (res.msg !== "wrong cred") {
                    localStorage.setItem("userName", res.userName)
                    localStorage.setItem("token", res.token)
                    val.handleAuth();
                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err, "catch"))
    }
    const handleClick = () => setShow(!show)
    return (
        <>
            <button className={style.Login} onClick={onOpen}>
                LOGIN
            </button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent style={{ backgroundColor: "#0a1e3bbd", opacity: "0.6" }}>
                    <ModalHeader style={{ margin: "auto", color: "white" }}>WELCOME</ModalHeader>
                    <ModalBody style={{ marginBottom: "1rem" }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png" alt="" style={{ width: "50%", margin: "auto" }} />
                        <h1 style={{ paddingLeft: "0.5rem", fontWeight: "500", color: "white" }}>Enter Email ID</h1>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                                children={<Icon as={MdEmail} color='white' boxSize={8} marginTop={"0.3rem"} />}
                            />
                            <Input placeholder='Email ID' name="email" type="email" onChange={(e) => handleChange(e)} size='lg' color={"white"} />
                        </InputGroup>
                        <br />
                        <h1 style={{ paddingLeft: "0.5rem", fontWeight: "500", color: "white" }}>Enter Password</h1>
                        <InputGroup size='md'>
                            <InputLeftElement
                                pointerEvents='none'
                                children={<Icon as={MdPassword} color='white' boxSize={8} marginTop={"0.3rem"} />}
                            />
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                name="pass"
                                placeholder='Enter password'
                                onChange={(e) => handleChange(e)}
                                size='lg'
                                color={"white"}
                            />
                            <InputRightElement width='4.5rem' marginTop={"0.2rem"}>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? <ViewIcon /> : <ViewOffIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <br />
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button mr={3} onClick={() => handleSubmit()}>Login</Button>
                        </div>
                        <br />
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Link to={"/adminlogin"}>
                                <Button mr={3} onClick={onClose} >Admin Login</Button>
                            </Link>
                        </div>
                        {/* <div onClick={onClose}>
                        <AdminLogin/>
                        </div> */}
                        
                    </ModalBody>
                    <hr />
                    <ModalFooter className={style.close} style={{ display: "flex", justifyContent: "center", paddingLeft: "1rem" }} onClick={onClose}>
                        Close
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Login
