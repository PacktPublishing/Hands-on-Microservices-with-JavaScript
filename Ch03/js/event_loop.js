function print(message) {
    console.log(message);
}

setTimeout(() => {
    console.log("Timeout is done. This is your message");
}, 0);

print("Message 1");
print("Message 2");
