import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { useEffect, useRef } from "react";
import HomePage from '@/pages/index'
import { decode } from "js-base64";
import { useSignal, initData } from "@telegram-apps/sdk-react";
// API 
import usersAPI from "@/lib/api/users";

const StudiosLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const navigate = useNavigate()

    const initDataRef = useSignal(initData.state)
    const {
        id: userid,
        username,
        firstName,
        languageCode,
        allowsWriteToPm,
    } = initDataRef?.user!
    const startParam  = initDataRef?.startParam

    const handleStartParam = (startParam: string) => {
        const decodedUrl = decode(startParam)

        if (decodedUrl.startsWith('/studio/')) {
            console.log('decodedUrl: ', decodedUrl)

            setTimeout(() => {
                navigate(decodedUrl);
            }, 200)
        }
    }   

    if (!userid) throw Error("Can't get userid")

    const checkUser = async () => {
        const userResult = await usersAPI.getUser(userid)

        if (userResult.success) {
            if (userResult.data === null) { // New user
                const newUserObject = {
                    userid: userid.toString(),
                    firstname: firstName,
                    username: username,
                    language_code: languageCode,
                    allows_write_to_pm: allowsWriteToPm,
                    has_pro: false
                }

                await usersAPI.createUser(newUserObject)
            }
        }
    }

    useEffect(() => {
        const isFirstLaunch = sessionStorage.getItem('isFirstLaunch');

        checkUser().then(() => {
            if (!isFirstLaunch) {
                console.log('Приложение только запустилось!');
                sessionStorage.setItem('isFirstLaunch', 'true');
    
                if (startParam !== undefined) {
                    handleStartParam(startParam)
                } 
            } 
    
            else console.log('Это не первый запуск, просто перезагрузка или переход');
        })
    }, []);

  return (
    <div>
        <ScrollRestoration />

        <div style={{ display: isHome ? 'block' : 'none' }}>
            <HomePage />
        </div>
        {isHome ? null : <Outlet />}
        {/* <Outlet /> Здесь рендерится текущий маршрут (список студий или детали студии) */}
    </div>
  );
};

export default StudiosLayout;
