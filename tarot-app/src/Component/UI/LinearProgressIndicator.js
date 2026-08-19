"use client";

import {useSpring,useScroll,motion} from "framer-motion";


const LinearProgressIndicator = ()=>{

  const backgroundXScale = useScroll();

   const scaleX = useSpring(backgroundXScale.scrollYProgress,{
    damping:10,
    stiffness:30,
    restDelta:0.3
   })

    return (
        <>
        <motion.div
          className="bg-gradient-to-b from-purple-600 to-purple-900"
        style={{
         scaleX:scaleX,
         position:"fixed",
         top:0,
         bottom:0,
         left:0,
         right:0,
         height:"2px",
         transition:"all linear 0.3s",
          transformOrigin: "0%",
          zIndex : 9999,
          originX:0     
        }}
        >
        </motion.div>
        </>
    )
}

export default LinearProgressIndicator;