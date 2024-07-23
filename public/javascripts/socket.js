module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('example_event', (data) => {
            console.log('Received data:', data);
            socket.emit('example_response', 'Data received');
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
