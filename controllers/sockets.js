const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');

const usuarioConectado = async( uid ) => {

    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();
    
    return usuario;
}

const usuarioDesconectado = async( uid ) => {
    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();
    
    return usuario;
}


const getUsuarios = async() => {

    const usuarios = await Usuario
        .find()
        .sort('-online');

    return usuarios;
}

const grabarMensaje = async( payload ) => {
    
    try {
        
        const mensaje = new Mensaje( payload );
        await mensaje.save();

        return mensaje;

    } catch (error) {
        console.log(error);
        return false;
    }

}


module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    getUsuarios,
    grabarMensaje
}
