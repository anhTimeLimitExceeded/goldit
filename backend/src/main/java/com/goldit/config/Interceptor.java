package com.goldit.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

public class Interceptor implements HandlerInterceptor {

	Logger logger = LoggerFactory.getLogger(Interceptor.class);

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		request.setAttribute("startTime", System.currentTimeMillis());
		request.setAttribute("reqid", UUID.randomUUID().toString());

		if("1".equals(request.getParameter("debug"))){
			return true;
		}

		UserRecord userRecord = null;

		String idToken = request.getHeader("authorization");
		if (idToken != null && !idToken.equals("no token")) {
			FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
			String uid = decodedToken.getUid();
			if (uid == null || "".equals(uid)) {
				logger.info("Request With Bad Authorization Header");
				response.sendError(HttpServletResponse.SC_BAD_REQUEST);
				return false;
			}
			userRecord = FirebaseAuth.getInstance().getUser(uid);
		}

		request.setAttribute("userRecord", userRecord);

		if (request.getMethod().equalsIgnoreCase("POST")) {
			if (userRecord == null) {
				logger.info("Request Without Authorization Header");
				response.sendError(HttpServletResponse.SC_BAD_REQUEST);
				return false;
			}
		}
		return true;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
		long startTime = (Long) request.getAttribute("startTime");
		long endTime = System.currentTimeMillis();
		long executeTime = endTime - startTime;
		logger.info("[{}], {}, {}ms", request.getAttribute("reqid"), request.getRequestURI(), executeTime);
	}

}
