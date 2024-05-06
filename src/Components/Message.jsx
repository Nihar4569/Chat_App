import { Avatar, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function Message({ text, url, user, name }) {
  return (
    <HStack width="100%" justifyContent={user === "me" ? "flex-end" : "flex-start"} mb={4}>
      {user !== "me" && <Avatar size="sm" src={url} />}
      <VStack alignItems={user === "me" ? "flex-end" : "flex-start"} spacing={1} maxWidth="70%" borderWidth={1} borderColor={user === "me" ? "blue.100" : "gray.100"} borderRadius="lg" p={2} bg={user === "me" ? "purple.100" : "gray.100"}>
        <Text fontSize="sm" style={{ fontSize: '10px' }} fontWeight="bold">@{name}</Text>
        <Text fontSize="sm">{text}</Text>
      </VStack>
      {user === "me" && <Avatar size="sm" src={url} />}
    </HStack>
  )
}

export default Message
