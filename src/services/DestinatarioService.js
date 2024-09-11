export const DestinatarioService = {

    buscarEmail: async (email) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 2,
                    "id": email,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }*/

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el email: ", error);
            throw new Error("Error al intentar buscar el email");
        }
    },

    buscarCUIT: async (CUIT) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 1,
                    "id": CUIT,
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

    getDestinatarios: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 0,
                },
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al obtener destinatarios: ", error);
            throw error;
        }
    },

    createDestinatario: async (destinatario) => {

        console.log(JSON.stringify(destinatario));

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(destinatario)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar crear el destinatario: ", error);
            throw new Error("Error al intentar crear el destinatario");
        }
    },

    updateDestinatario: async (destinatario) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(destinatario)
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

    deleteDestinatario: async (destinatario) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(destinatario)
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