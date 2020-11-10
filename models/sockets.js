const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado,
        usuarioDesconectado,
        grabarMensaje,
        getUsuarios } = require('../controllers/sockets');

class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

            const [ valido, uid ] = comprobarJWT( socket.handshake.query['x-token']  );

            if ( !valido ) {
                console.log('socket no identificado');
                return socket.disconnect();
            }

            await usuarioConectado( uid );

            // Unir al usuario a una sala de socket.io
            socket.join( uid );

            // TODO: Validar el JWT 
            // Si el token no es válido, desconectar

            // TODO: Saber que usuario está activo mediante el UID

            // TODO: Emitir todos los usuarios conectados
            this.io.emit( 'lista-usuarios', await getUsuarios() )

            // TODO: Socket join, uid

            // TODO: Escuchar cuando el cliente manda un mensaje
            socket.on( 'mensaje-personal', async( payload ) => {
                const mensaje = await grabarMensaje( payload );
                this.io.to( payload.para ).emit( 'mensaje-personal', mensaje );
                this.io.to( payload.de ).emit( 'mensaje-personal', mensaje );
            });
            

            // TODO: Disconnect
            // Marcar en la BD que el usuario se desconecto
            // TODO: Emitir todos los usuarios conectados
            socket.on('disconnect', async() => {
                await usuarioDesconectado( uid );
                this.io.emit( 'lista-usuarios', await getUsuarios() )
            })
            
        
        });
    }


}


module.exports = Sockets;