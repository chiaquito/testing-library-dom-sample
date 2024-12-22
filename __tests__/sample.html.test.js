// query utilities:
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import $ from "jquery";
import { screen, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// 各テストの前に実行される
beforeEach(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "..", "static", "sample.html");
  const htmlContent = fs.readFileSync(filePath, "utf8");

  document.body.innerHTML = htmlContent;
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.textContent) {
      eval(script.textContent);
    }
  });
});

// 各テストの後に実行される
afterEach(() => {
  document.body.innerHTML = ""; // DOMをクリア // Testing Libraryのクリーンアップ関数を呼ぶ
});

describe("初期表示のテスト", () => {
  describe("上部初期表示", () => {
    it("text「ボタンを押すとテキストが変わります」がある", () => {
      const got = screen.getByText(/ボタンを押すとテキストが変わります/i);
      // explicitly assert
      expect(got).toBeInTheDocument();
    });

    it("button「テキストが変わるボタン」がある", () => {
      const got = screen.getByRole("button", {
        name: "テキストが変わるボタン",
      });
      expect(got).toBeInTheDocument();
    });
  });

  describe("中部初期表示", () => {
    it("button「活性と非活性が変わるボタン」は活性状態である", () => {
      const got = screen.getByRole("button", {
        name: /活性と非活性が変わるボタン/i,
      });
      expect(got).toBeInTheDocument();
      expect(got).not.toBeDisabled();
    });

    it("button「活性と非活性を変えるボタン」がある", () => {
      const got = screen.getByRole("button", {
        name: /活性と非活性を変えるボタン/i,
      });
      expect(got).toBeInTheDocument();
      expect(got).not.toBeDisabled();
    });
  });

  describe("下部初期表示", () => {
    it("input「都道府県」の初期値は空文字である", () => {
      const got = screen.getByPlaceholderText(/都道府県/i);
      expect(got).toBeInTheDocument();
      expect(got).toHaveValue("");
    });

    it("input「市区町村」の初期値は空文字である", () => {
      const got = screen.getByPlaceholderText(/市区町村/i);
      expect(got).toBeInTheDocument();
      expect(got).toHaveValue("");
    });

    it("input「町域名」の初期値は空文字である", () => {
      const got = screen.getByPlaceholderText(/町域名/i);
      expect(got).toBeInTheDocument();
      expect(got).toHaveValue("");
    });

    it("input「郵便番号」の初期値は「7830060」である", () => {
      const got = screen.getByPlaceholderText(/郵便番号/i);
      expect(got).toBeInTheDocument();
      expect(got).toHaveValue(7830060);
    });

    it("button「郵便番号から地域情報を取得」がある", () => {
      const got = screen.getByRole("button", {
        name: /郵便番号から地域情報を取得/i,
      });
      expect(got).toBeInTheDocument();
      expect(got).not.toBeDisabled();
    });
  });
});

describe("UI操作テスト", () => {
  const user = userEvent.setup();
  describe("上部UI操作", () => {
    it("ボタンを1回押すと「ボタンを押すとテキストが変わります」テキストが「◎」になる", async () => {
      const got = screen.getByText(/ボタンを押すとテキストが変わります/i);
      expect(got).toBeInTheDocument();
      const btn = screen.getByRole("button", {
        name: "テキストが変わるボタン",
      });
      await user.click(btn);
      expect(got).toHaveTextContent("◎");
    });

    it("ボタンを2回押すと「ボタンを押すとテキストが変わります」テキストが「◎☆」になる", async () => {
      const got = screen.getByText(/ボタンを押すとテキストが変わります/i);
      expect(got).toBeInTheDocument();
      const btn = screen.getByRole("button", {
        name: "テキストが変わるボタン",
      });
      await user.click(btn);
      await user.click(btn);
      expect(got).toHaveTextContent("◎☆");
    });

    it("ボタンを3回押すと「ボタンを押すとテキストが変わります」テキストが「◎☆◎」に変わる", async () => {
      const got = screen.getByText(/ボタンを押すとテキストが変わります/i);
      expect(got).toBeInTheDocument();
      const btn = screen.getByRole("button", {
        name: "テキストが変わるボタン",
      });
      await user.click(btn);
      await user.click(btn);
      await user.click(btn);
      expect(got).toHaveTextContent("◎☆◎");
    });

    it("ボタンを10回押すと「ボタンを押すとテキストが変わります」テキストが「◎☆◎☆◎☆◎☆◎☆」に変わる", async () => {
      const got = screen.getByText(/ボタンを押すとテキストが変わります/i);
      expect(got).toBeInTheDocument();
      const btn = screen.getByRole("button", {
        name: "テキストが変わるボタン",
      });

      for (const ele of new Array(10).fill(null)) {
        await user.click(btn);
      }

      expect(got).toHaveTextContent("◎☆◎☆◎☆◎☆◎☆");
    });
  });

  describe("中部UI操作", () => {
    it("ボタンを1回押すと「活性と非活性が変わるボタン」は非活性状態になる", async () => {
      const btn = screen.getByRole("button", {
        name: /活性と非活性を変えるボタン/i,
      });

      await user.click(btn);

      const got = screen.getByRole("button", {
        name: /活性と非活性が変わるボタン/i,
      });
      expect(got).toBeDisabled();
    });

    it("ボタンを2回押すと「活性と非活性が変わるボタン」は活性状態になる", async () => {
      const btn = screen.getByRole("button", {
        name: /活性と非活性を変えるボタン/i,
      });

      await user.click(btn);
      await user.click(btn);

      const got = screen.getByRole("button", {
        name: /活性と非活性が変わるボタン/i,
      });
      expect(got).not.toBeDisabled();
    });

    it("ボタンを3回押すと「活性と非活性が変わるボタン」は非活性状態になる", async () => {
      const btn = screen.getByRole("button", {
        name: /活性と非活性を変えるボタン/i,
      });

      await user.click(btn);
      await user.click(btn);
      await user.click(btn);

      const got = screen.getByRole("button", {
        name: /活性と非活性が変わるボタン/i,
      });
      expect(got).toBeDisabled();
    });
  });

  describe("下部UI操作", () => {
    const user = userEvent.setup();

    it("郵便番号「8100001」を入力してボタンを押すとinput「都道府県」は福岡県になる", async () => {
      const inputZipcode = screen.getByPlaceholderText(/郵便番号/i);
      await user.clear(inputZipcode);
      await user.type(inputZipcode, "8100001");
      const btn = screen.getByRole("button", {
        name: /郵便番号から地域情報を取得/i,
      });
      await user.click(btn);

      const got = screen.getByPlaceholderText(/都道府県/i);
      await waitFor(() => {
        expect(got).toBeInTheDocument();
        expect(got).toHaveValue("福岡県");
      });
    });

    it("郵便番号「8100001」を入力してボタンを押すとinput「市区町村」は福岡市中央区になる", async () => {
      const inputZipcode = screen.getByPlaceholderText(/郵便番号/i);
      await user.clear(inputZipcode);
      await user.type(inputZipcode, "8100001");
      const btn = screen.getByRole("button", {
        name: /郵便番号から地域情報を取得/i,
      });
      await user.click(btn);

      const got = screen.getByPlaceholderText(/市区町村/i);
      await waitFor(() => {
        expect(got).toBeInTheDocument();
        expect(got).toHaveValue("福岡市中央区");
      });
    });

    it("郵便番号「8100001」を入力してボタンを押すとinput「町域名」は天神になる", async () => {
      const inputZipcode = screen.getByPlaceholderText(/郵便番号/i);
      await user.clear(inputZipcode);
      await user.type(inputZipcode, "8100001");
      const btn = screen.getByRole("button", {
        name: /郵便番号から地域情報を取得/i,
      });
      await user.click(btn);

      const got = screen.getByPlaceholderText(/町域名/i);
      await waitFor(() => {
        expect(got).toBeInTheDocument();
        expect(got).toHaveValue("天神");
      });
    });
  });
});
