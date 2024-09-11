export const UsuarioService = {

    getUsuarios: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 1,
                },
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al obtener usuarios: ", error);
            throw error;
        }
    },

    createUsuario: async (usuario) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(usuario)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar crear el usuario: ", error);
            throw new Error("Error al intentar crear el usuario");
        }
    },

    buscarUsuarioCompleto: async (idCab) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 4,
                    "idCab": idCab,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }*/

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el usuario: ", error);
            throw new Error("Error al intentar buscar el usuario");
        }
    },

    buscarCUIT: async (idCab) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 2,
                    "idCab": idCab,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }*/

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el cuit: ", error);
            throw new Error("Error al intentar buscar el cuit");
        }
    },

    buscarNombreUsuario: async (idCab) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "idCab": idCab,
                    "buscar": 3,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }*/

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el usuario: ", error);
            throw new Error("Error al intentar buscar el usuario");
        }
    },

    updateUsuario: async (usuario) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(usuario)
            })

            if(!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    },

    deleteUsuario: async (usuario) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stusrperm`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(usuario)
            })

            if(!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    }



}