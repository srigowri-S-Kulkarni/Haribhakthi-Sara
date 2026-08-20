package com.haribhakthi.user;

import com.haribhakthi.common.dto.UserDto;
import com.haribhakthi.config.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), updates));
    }
}
