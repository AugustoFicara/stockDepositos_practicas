export const ProveedorService = {

    buscarEmail: async (email) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stprov`, {
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

            let response = await fetch(`${process.env.REACT_APP_URL}stprov`, {
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

    getProveedores: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stprov`, {
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
            console.error("Error al obtener proveedores: ", error);
            throw error;
        }
    },

    createProveedor: async (proveedor) => {

        console.log(JSON.stringify(proveedor));

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stprov`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(proveedor)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar crear el proveedor: ", error);
            throw new Error("Error al intentar crear el proveedor");
        }
    },

    updateProveedor: async (proveedor) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stprov`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(proveedor)
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

    deleteProveedor: async (proveedor) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stprov`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(proveedor)
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