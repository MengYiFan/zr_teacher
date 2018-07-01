// export const API_URI = 'http://192.168.0.103:9100/stg'
// export const API_URI = 'http://www.zredq.com:9100/stg'
export const API_URI = 'https://app.shangnarxue.com/stg'

export const USER_LOGON = API_URI + '/user/nonlogin/login'

export const ASSIGN_LINK = API_URI + '/consult/assign/link'

export const BIND_USER = API_URI + '/user/login/bindingUser'// 缺少密码和地域字段

export const UPDATE_USER = API_URI + '/user/login/update'

export const CASE_LIST = API_URI + '/teacher/case/teacherCaseList'

export const IS_ONLINE = API_URI + '/consult/isonline'

export const HELP_LINK = API_URI + '/consult/link'
export const HELP_CALL_HANGUP = API_URI + '/consult/hangup'

export const COURSE_LIST = API_URI + '/course/parent/myCourseList'

export const MY_COURSE_LIST = API_URI + '/course/teacher/myCourseList'

export const TEACHER_SIGNIN = API_URI + '/consult/signin'
export const SIGNOUT = API_URI + '/consult/signout'

export const PHONE_VALIDATION_CODE = API_URI + '/none/sendcode'

export const TEACHER_COLUMN_SUBSCRIBE = API_URI + '/teacher/column/columnSubscribe'
export const TEACHER_CONTENT_LIST = API_URI + '/teacher/column/teacherContentList'

// v2
export const GET_IM = API_URI + '/im/login'
export const POLLING_URI = API_URI + '/consult/connecting'
export const ENTER_ROOM = API_URI + '/rtcroom/pusher/enter'
export const ENTER_RTCROOM = API_URI + '/rtcroom'
export const EXIT_RTCROOM = API_URI + '/rtcroom/pusher/exit'
export const HEARTBEAT = API_URI + '/rtcroom/heartbeat'

export const CATEGORY_QUS = API_URI + '/consult/category/question'
export const FEE_QUS = API_URI + '/consult/category-charge/question'

export const SUBJECT_LIST = API_URI + '/user/login/mySubjectList'
export const UPDATE_SUBJECT = API_URI + '/user/login/updateMySubject'

export const INCOME = API_URI + '/user/login/walletLoyaltyInfo'

//
export const GET_PUSHER = API_URI + '/consult/getpushurl'

export const HANGUP_APPLY = API_URI + '/consult/hangup/apply'
