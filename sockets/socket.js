const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band( 'Queen' ) );
bands.addBand( new Band('Bon jovi') );
bands.addBand( new Band('Héroes del silencio') );
bands.addBand( new Band( 'Metallica' ) );

console.log(bands);

//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payLoad )=>{
        console.log('Mensaje!!', payLoad);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } )
    });

    client.on('vote-band', (payLoad) => {

        bands.voteBand( payLoad.id );
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payLoad) => {
        
        const newBand = new Band( payLoad.name );
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands());

    });

    client.on('delete-band', (payLoad) => {

        bands.deleteband( payLoad.id );
        io.emit('active-bands', bands.getBands());

    });
    // client.on('emitir-mensaje', ( payload )=> {
    //     // console.log(payload);
    //     // io.emit('nuevo-mensaje', payload ); //emite a todos 
    //     client.broadcast.emit('nuevo-mensaje', payload ); //emite a todos menos al que lo emitio
    // });
});