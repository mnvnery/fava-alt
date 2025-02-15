import Nav from '../components/Nav'
import Questionaire from '../components/Questionaire'
import AuthGuard from '../components/AuthGuard';

export default function Order() {
    return (    
        <AuthGuard>
            <Nav/>
            <Questionaire/>
        </AuthGuard>
    );
}