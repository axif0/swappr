import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

const useCart = () => {
    const { user } = useContext(AuthContext);
    // console.log(user.email)
    const token = localStorage.getItem('access-token')
    
    const { refetch, data: cart = [], isError, error } = useQuery({
        queryKey: ['carts', user?.email],
        queryFn: async () => {
            try {
                const res = await fetch(`http://localhost:6001/carts?email=${user?.email}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
    
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
    
                return res.json();
            } catch (error) {
                throw new Error('An error occurred while fetching cart data');
            }
        },
    });
    

    return [cart, refetch]

}
export default useCart;