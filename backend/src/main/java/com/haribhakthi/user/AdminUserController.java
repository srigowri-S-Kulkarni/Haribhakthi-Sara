package com.haribhakthi.user;

import com.haribhakthi.common.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsersForAdmin() {
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }

    @PostMapping("/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable UUID id, @RequestParam("role") String role) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAccount(@PathVariable UUID id) {
        userService.deleteUserAccount(id);
        return ResponseEntity.noContent().build();
    }
}
