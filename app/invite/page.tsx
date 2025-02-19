import { Suspense } from 'react';
import Nav from '../components/Nav'
import TokenSignUp from '../components/TokenSignUp'
import Loading from '../loading';

export default function Invite() {
    return (    
        <div className=''>
            <Nav/>
            <Suspense fallback={<Loading/>}>
                <TokenSignUp />
            </Suspense>
        </div>
    );
}