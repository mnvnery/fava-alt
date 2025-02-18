import { Suspense } from 'react';
import Nav from '../components/Nav'
import TokenSignUp from '../components/TokenSignUp'

export default function Invite() {
    return (    
        <div className=''>
            <Nav/>
            <Suspense fallback={<div>Loading...</div>}>
                <TokenSignUp />
            </Suspense>
        </div>
    );
}