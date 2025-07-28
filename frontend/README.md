<<<<<<< HEAD
=======
# 민생내비 - 지역 기반 매장 검색 서비스

이 프로젝트는 지역과 카테고리별로 매장을 검색하고 지도에서 확인할 수 있는 웹 애플리케이션입니다.

## 네이버 지도 API 설정

이 프로젝트는 [네이버 클라우드 플랫폼 Maps API](https://www.ncloud.com/product/applicationService/maps#detail)를 사용합니다.

### 1. 네이버 클라우드 플랫폼 가입 및 API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 가입
2. Maps 서비스 신청
3. Application 등록 후 **ncpKeyId** 발급 (기존 ncpClientId에서 변경됨)
4. **중요**: Application 설정에서 도메인 등록 필요
   - `http://localhost:3000` (개발용)
   - `http://localhost:3001` (개발용)
   - 실제 배포 도메인 (운영용)

### 2. 환경변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
REACT_APP_NAVER_CLIENT_ID=YOUR_NCP_KEY_ID_HERE
```

### 3. API 사용량

네이버 Maps API는 다음과 같은 무료 사용량을 제공합니다:
- Dynamic Map: 월 6,000,000건
- Static Map: 월 3,000,000건  
- Geocoding: 월 3,000,000건
- Reverse Geocoding: 월 3,000,000건
- Directions 5: 월 60,000건
- Directions 15: 월 3,000건

### 4. 인증 실패 문제 해결

API 인증에 실패하는 경우 다음을 확인하세요:

1. **API 키 확인**: 올바른 **ncpKeyId**를 사용하고 있는지 확인 (기존 ncpClientId에서 변경됨)
2. **도메인 등록**: 네이버 클라우드 콘솔에서 Application 설정의 도메인에 현재 도메인이 등록되어 있는지 확인
3. **브라우저 콘솔 확인**: F12를 눌러 개발자 도구에서 에러 메시지 확인
4. **환경변수 재시작**: `.env` 파일 수정 후 React 개발 서버 재시작 필요
5. **새로운 API 사용**: 기존 ncpClientId 대신 **ncpKeyId** 사용 필요

## 주요 기능

- **지역별 매장 검색**: 도/시군구별 매장 필터링
- **카테고리별 검색**: 음식점, 카페 등 카테고리별 필터링
- **지도 표시**: 네이버 지도 API를 사용한 인터랙티브 지도
- **마커 표시**: 매장 위치를 지도에 마커로 표시 (사용 가능 여부에 따른 색상 구분)
- **상세 정보**: 마커 클릭 시 매장 상세 정보 및 결제 수단 표시
- **길찾기**: 현재 위치에서 매장까지의 경로 안내
- **현재 위치 설정**: GPS를 통한 현재 위치 확인
- **결제 수단 표시**: 충전식 카드, 지류, 모바일 취급 여부 표시

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 기술 스택

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Maps API**: 네이버 클라우드 플랫폼 Maps API

>>>>>>> sub3
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
