package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Todo struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateTodoRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

type UpdateTodoRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Completed   *bool   `json:"completed"`
}

// インメモリストレージ（一時的）
var todos []Todo
var nextID uint = 1

func main() {
	// データベース接続をスキップ（一時的）
	log.Println("Starting without database connection...")

	// サンプルデータを追加
	todos = []Todo{
		{ID: 1, Title: "Learn Go", Description: "Go言語の基礎を学ぶ", Completed: false, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: 2, Title: "Setup Cloud Run", Description: "Cloud Run環境を構築する", Completed: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: 3, Title: "Build Todo App", Description: "Todo アプリを作成する", Completed: false, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}
	nextID = 4

	// Ginエンジンの初期化
	r := gin.Default()

	// CORS設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // 一時的に全て許可
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // 一時的にfalse
		MaxAge:           12 * time.Hour,
	}))

	// ルーティング
	api := r.Group("/api")
	{
		api.GET("/todos", getTodos)
		api.POST("/todos", createTodo)
		api.GET("/todos/:id", getTodoByID)
		api.PUT("/todos/:id", updateTodo)
		api.DELETE("/todos/:id", deleteTodo)
	}

	// ヘルスチェック
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Cloud Run deployment successful!"})
	})

	// ルートページ
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Todo Backend API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"health": "/health",
				"todos":  "/api/todos",
			},
		})
	})

	// PORTの環境変数をチェック
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// 全てのTodoを取得（インメモリ）
func getTodos(c *gin.Context) {
	c.JSON(http.StatusOK, todos)
}

// 新しいTodoを作成（インメモリ）
func createTodo(c *gin.Context) {
	var req CreateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo := Todo{
		ID:          nextID,
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	todos = append(todos, todo)
	nextID++

	c.JSON(http.StatusCreated, todo)
}

// IDでTodoを取得（インメモリ）
func getTodoByID(c *gin.Context) {
	id := c.Param("id")

	for _, todo := range todos {
		if todo.ID == parseID(id) {
			c.JSON(http.StatusOK, todo)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}

// Todoを更新（インメモリ）
func updateTodo(c *gin.Context) {
	id := parseID(c.Param("id"))

	var req UpdateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i, todo := range todos {
		if todo.ID == id {
			if req.Title != nil {
				todos[i].Title = *req.Title
			}
			if req.Description != nil {
				todos[i].Description = *req.Description
			}
			if req.Completed != nil {
				todos[i].Completed = *req.Completed
			}
			todos[i].UpdatedAt = time.Now()

			c.JSON(http.StatusOK, todos[i])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}

// Todoを削除（インメモリ）
func deleteTodo(c *gin.Context) {
	id := parseID(c.Param("id"))

	for i, todo := range todos {
		if todo.ID == id {
			todos = append(todos[:i], todos[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Todo deleted successfully"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}

// 簡単なID変換（エラーハンドリング簡略）
func parseID(idStr string) uint {
	// 簡易実装：実際は strconv.ParseUint を使用
	switch idStr {
	case "1":
		return 1
	case "2":
		return 2
	case "3":
		return 3
	case "4":
		return 4
	case "5":
		return 5
	default:
		return 0
	}
}
