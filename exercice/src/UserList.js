import React, { useState, useEffect } from 'react';
import userData from './api/data.json';

const UserList = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const uniqueDepartments = [...new Set(userData.flatMap(user => user.departments))];

    // Filtrer les codes de département non valides
    const validDepartments = uniqueDepartments.filter(dept => dept !== 20);

    useEffect(() => {
        Promise.all(validDepartments.map(dept => 
            fetch(`https://geo.api.gouv.fr/departements/${dept}`)
                .then(response => {
                    if (!response.ok) {
                        // Si la réponse n'est pas OK, rejeter la promesse pour éviter d'ajouter un résultat non valide
                        throw new Error(`Department ${dept} not found`);
                    }
                    return response.json();
                })
        ))
        .then(results => setDepartments(results))
        .catch(error => console.error('Error fetching department names:', error));
    }, []);

    return (
        <div className="user-list-container">
            <select className="department-dropdown" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                <option value="all">Tous les départements</option>
                {departments.map(dept => (
                    <option key={dept.code} value={dept.code}>{dept.nom}</option>
                ))}
            </select>

            <ul className="user-list">
                <h3>Liste des utilisateurs</h3>
                {userData
                    .filter(user => selectedDepartment === 'all' || user.departments.includes(Number(selectedDepartment)))
                    .map(user => (
                        <li key={user.id} className="user-item">{user.name}</li>
                    ))}
            </ul>
        </div>
    );
}

export default UserList;
