function print(message) {
    console.log(message);
}

setTimeout(() => {
    print("Message from Timeout");
}, 0);

print("Message 1");
print("Message 2");
