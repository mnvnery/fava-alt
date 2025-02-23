import { Suspense } from 'react';
import TokenSignUp from '../components/TokenSignUp'
import Loading from '../loading';

export default function Invite() {
    return (    
        <div className=''>

            <Suspense fallback={<Loading/>}>
                <TokenSignUp />
            </Suspense>
        </div>
    );
}