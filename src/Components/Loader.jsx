import { Spinner } from '@chakra-ui/react'
import React from 'react'

function Loader() {
    return (

        <>
        
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='purple'
                color='blue.500'
                width='50px' // Custom width
                height='50px' // Custom height
            />
        </>

    )
}

export default Loader