import React, { useState } from 'react';

function Ajustes() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para cambiar la contraseña
        if (newPassword !== confirmPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }
        // Aquí puedes agregar la lógica para cambiar la contraseña del usuario
        alert('Contraseña cambiada exitosamente');
    };

    return (
        <>
            <h1 className="text-center text-bg-dark p-2">&mdash; Ajustes de usuario &mdash;</h1>
            <form onSubmit={handleSubmit} className='w-50 p-5'>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="currentPassword"
                        placeholder="Ingrese su contraseña actual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="newPassword"
                            placeholder="Ingrese su nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={toggleShowPassword}
                        >
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirme su nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Cambiar Contraseña
                </button>
            </form>
        </>

    );
}

export default Ajustes;
