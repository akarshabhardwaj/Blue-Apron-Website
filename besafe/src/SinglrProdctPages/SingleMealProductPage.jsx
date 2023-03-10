import React, { useEffect, useState } from "react";
import styles from "./SingleMealProductPage.module.css";
import { SocialFooter } from "../Components/SocialFooter";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

import {
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Image,
  useToast,
} from "@chakra-ui/react";

// created a custom object with same schema for cheking UI

function SingleMealProductPage() {
  const { isOpen, onOpen, onClose } = useDisclosure(); //To open or close modal of small product img
  const [product, setProduct] = useState(); //paased custom obj to check UI
  const [qty, setQty] = useState(1); //storing selected qty for a product
  const [modalImg, setModalImg] = useState(""); //storing modal img link on clicking on particular image
  const [isLoading, setIsLoading] = useState(true); //storing value for skeleton loading
  const { _id } = useParams();

  // console.log(_id)
  useEffect(() => {
    let fetchData = async () => {
      try {
        let res = await fetch(
          `https://dark-red-goshawk-gown.cyclic.app/meals/${_id}`,
          {
            method: "GET",
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "Application/json",
            },
          }
        );
        let data = await res.json();
        // console.log(data);
        setIsLoading(false);
        setProduct(data.msg);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [_id]);
  console.log(product);
  function handleModalImg(imgLink) {
    onOpen();
    setModalImg(imgLink);
  }
  const toast = useToast()

  const AddToCart=async (product)=>{
    let obj={name:product.name,img:product.img,price:product.price,username:localStorage.getItem("userName")}
    console.log(obj)
   // console.log(product,localStorage.getItem("userName"))
    let res=await fetch(`https://dark-red-goshawk-gown.cyclic.app/cart/addtocart`,{
      method:"POST",
      headers:{
        Authorization:localStorage.getItem("token"),
        "Content-type":"application/json"
      },
      body:JSON.stringify(obj)
    })
  
    let ans=await res.json()
    console.log(ans)
    // alert(ans.msg)
    toast({
      title: "Add to Basket",
      description: "You Can See Cart Now",
      variant: "subtle",
      status:'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
    })
  }

  //
  // const addToBasket = ()=>{
    
  //   toast({
  //     title: "Add to Basket",
  //     description: "You Can See Cart Now",
  //     variant: "subtle",
  //     status:'success',
  //     position: 'top-right',
  //     duration: 3000,
  //     isClosable: true,
  //   })
  // }

  // console.log(product);

  if (isLoading) {
    return (
      <>
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Box>
      </>
    );
  } else {
    return (
      // Main container
      <>
        <div className={styles.container}>
          {/* {product?.map((items) => ( */}
          <>
            <div className={styles.product_img}>
              {/************************** Showing big image  ************/}
              <img src={product?.img[0].subImage} alt="Product" />
              <br></br>

              {/************** Showing all buttom small image *************/}
              <div className={styles.small_img}>
                {product?.img.slice(1).map((img) => (
                  <>
                    <Image
                      // onClick={onOpen}
                      onClick={() => handleModalImg(img.subImage)}
                      _hover={{ cursor: "pointer" }}
                      m="auto"
                      w="125px"
                      h="120px"
                      src={img.subImage}
                      alt="Prodoct image"
                    />
                  </>
                ))}

                {/**************** To open a modal on clicking above small img **************/}
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalCloseButton bg="#f9f9f9" borderRadius="25px" />
                    <ModalBody p="4" m="0">
                      <Image src={modalImg} w="100%" />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </div>
            </div>

            {/***************** Rigth side of product details ****************/}
            <div className={styles.product_details}>
              <div>
                {/* Showing name */}
                <Heading size="lg" mb="10px">
                  {product?.name}
                </Heading>

            {/******************** To show price, qty, addtocart btn ***********************/}
            <div className={styles.cart_box}>
              <p className={styles.price}>
                <span>
                  Price $<span>{product?.price}</span>
                </span>
              </p>
              {/* <select onChange={(e) => setQty(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select> */}
              <button onClick={()=>{AddToCart(product)}}>ADD TO BASKET</button>
            </div>

                {/* Showing Sub description after name */}
                <p className={styles.highlights}>{product?.subDes}</p>
              </div>

             
              {/****************** Long description ******************/}
              <div className={styles.description}>
                <p>{product?.des}</p>
                <br></br>
                <p>{product?.listHead}</p>
                <br></br>
                <div>
                  {product?.listContent?.map((list) => (
                    <>
                      <li>{list.content}</li>
                    </>
                  ))}
                </div>
                <br></br>
                <p>
                  Expertly crafted with quality, pre-prepped ingredients to save
                  you time in the kitchen, the Fireside Feast can be prepped in
                  two hours, opposed to the 40+ hours it would take to make duck
                  confit from scratch!
                </p>
                <br></br>
                <p>
                  Order will deliver within 4 business days, delivery date
                  options given at checkout.
                </p>
                <br></br>

                {/************ Tab Options ***********/}
                <div>
                  <Tabs variant="enclosed" color="gray">
                    <TabList>
                      <Tab fontWeight="500">What's Included</Tab>
                      <Tab fontWeight="500">Order & Shipping</Tab>
                      <Tab fontWeight="500">Nutrition Facts</Tab>
                    </TabList>
                    <TabPanels color="black" border="1px solid #e8edf3">
                      <TabPanel>
                        <li>
                          Folder with tips on how to create a memorable feast
                          for friends
                        </li>
                        <li>Easy-to-follow recipe instructions</li>
                        <li>Extra entertaining tips</li>
                      </TabPanel>
                      <TabPanel>
                        <li>
                          Order will deliver within 4 business days, delivery
                          date options given at checkout.
                        </li>
                        <li>
                          No order changes or cancellations after check-out
                        </li>
                        <li>Shipping included in price</li>
                      </TabPanel>
                      <TabPanel>
                        <li>Duck Confit Cassoulet</li>
                        <li>Parmesan & Garlic-Herb Bread</li>
                        <li>Orange & Pistachio Salad</li>
                        <li>Chocolate Chip & Almond Biscotti</li>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>
              </div>
            </div>
          </>
          {/* ))} */}
        </div>
        <SocialFooter />
      </>
    );
  }
}

export { SingleMealProductPage };
