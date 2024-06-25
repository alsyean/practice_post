#!/bin/bash

# Helm 설치 (이미 설치되어 있는 경우 생략 가능)
if ! command -v helm &> /dev/null
then
    echo "Helm을 설치 중..."
    curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
else
    echo "Helm이 이미 설치되어 있습니다."
fi

# Kubernetes 네임스페이스 생성
kubectl create namespace argocd

# Helm 리포지토리 추가 및 업데이트
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# Argo CD 설치
helm install argocd argo/argo-cd --namespace argocd

# 초기 관리자 비밀번호 확인
echo "초기 관리자 비밀번호를 확인 중..."
PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode)
echo "초기 관리자 비밀번호: $PASSWORD"

# 포트 포워딩 설정
echo "Argo CD 서버 포트 포워딩을 설정 중..."
kubectl port-forward svc/argocd-server -n argocd 8080:443 &
echo "Argo CD 웹 UI는 http://localhost:8080 에서 접근 가능합니다."

# 로그인 정보 출력
echo "Argo CD 로그인 정보:"
echo "URL: http://localhost:8080"
echo "Username: admin"
echo "Password: $PASSWORD"
